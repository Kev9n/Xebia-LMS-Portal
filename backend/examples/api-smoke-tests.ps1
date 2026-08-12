param(
    [string]$BaseUrl = "http://localhost:8080",
    [string]$TenantId = "11111111-1111-1111-1111-111111111111",
    [string]$AdminEmail = "admin@lms.local",
    [string]$AdminPassword = "AdminChangeMe123!"
)

$ErrorActionPreference = "Stop"
$jsonHeaders = @{ "Content-Type" = "application/json" }

function To-JsonBody($value) {
    return ($value | ConvertTo-Json -Depth 8)
}

function Invoke-WithRetry {
    param(
        [scriptblock]$Operation,
        [int]$Attempts = 18,
        [int]$DelaySeconds = 5
    )

    for ($i = 1; $i -le $Attempts; $i++) {
        try {
            return & $Operation
        } catch {
            if ($i -eq $Attempts) {
                throw
            }

            Write-Host "Waiting for backend readiness ($i/$Attempts)..."
            Start-Sleep -Seconds $DelaySeconds
        }
    }
}

Write-Host "1. Login"
$login = Invoke-WithRetry {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/iam/auth/login" -Headers $jsonHeaders -Body (To-JsonBody @{
        tenantId = $TenantId
        email = $AdminEmail
        password = $AdminPassword
    })
}

$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $($login.accessToken)"
}

$suffix = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()

Write-Host "2. Create role"
$role = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/iam/roles" -Headers $authHeaders -Body (To-JsonBody @{
    code = "SMOKE_ROLE_$suffix"
    name = "Smoke Role $suffix"
})

Write-Host "3. Create permission"
$permission = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/iam/permissions" -Headers $authHeaders -Body (To-JsonBody @{
    code = "SMOKE_PERMISSION_$suffix"
    description = "Smoke test permission"
})

Write-Host "4. Assign permission to role"
Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/iam/roles/$($role.id)/permissions" -Headers $authHeaders -Body (To-JsonBody @{
    permissionId = $permission.id
}) | Out-Null

Write-Host "5. Assign module to role"
$modules = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/iam/modules" -Headers $authHeaders
$module = $modules | Where-Object { $_.code -eq "COURSES" } | Select-Object -First 1
Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/iam/roles/$($role.id)/modules" -Headers $authHeaders -Body (To-JsonBody @{
    moduleId = $module.id
}) | Out-Null

Write-Host "6. List effective permissions and visible modules"
$effective = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/iam/me/permissions" -Headers $authHeaders
$visibleModules = Invoke-RestMethod -Method Get -Uri "$BaseUrl/api/iam/me/modules" -Headers $authHeaders

Write-Host "7. Create university"
$university = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/organisations/universities" -Headers $authHeaders -Body (To-JsonBody @{
    name = "Smoke University $suffix"
    type = "UNIVERSITY"
    officialContactName = "Smoke Registrar"
    officialContactEmail = "registrar-$suffix@example.edu"
    officialContactPhone = "+911234567890"
})

Write-Host "8. Update official contact"
$university = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/organisations/universities/$($university.id)/official-contact" -Headers $authHeaders -Body (To-JsonBody @{
    officialContactName = "Smoke Registrar Updated"
    officialContactEmail = "registrar-updated-$suffix@example.edu"
    officialContactPhone = "+911234567891"
})

Write-Host "9. Create trainer"
$trainer = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/users/trainers" -Headers $authHeaders -Body (To-JsonBody @{
    iamUserId = [guid]::NewGuid().ToString()
    email = "trainer-$suffix@example.edu"
    fullName = "Smoke Trainer $suffix"
    userType = "TRAINER"
    primarySubject = "JAVA"
    universityId = $university.id
})

Write-Host "10. Create course"
$course = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/courses" -Headers $authHeaders -Body (To-JsonBody @{
    title = "Smoke Course $suffix"
    description = "Smoke test course"
    published = $true
})

Write-Host "11. Create course module and submodule"
$courseModule = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/courses/$($course.id)/modules" -Headers $authHeaders -Body (To-JsonBody @{
    title = "Smoke Module"
    position = 1
})
$submodule = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/courses/$($course.id)/modules/$($courseModule.id)/submodules" -Headers $authHeaders -Body (To-JsonBody @{
    title = "Smoke Submodule"
    position = 1
})

Write-Host "12. Add content items"
foreach ($contentType in @("NOTE", "PDF", "PPT", "COMPARISON_TABLE", "VIDEO_REFERENCE")) {
    Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/courses/$($course.id)/content-items" -Headers $authHeaders -Body (To-JsonBody @{
        moduleId = $courseModule.id
        subModuleId = $submodule.id
        title = "Smoke $contentType"
        type = $contentType
        storageRef = "smoke://$contentType/$suffix"
        position = 1
    }) | Out-Null
}

Write-Host "13. Create batch"
$batch = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/batches" -Headers $authHeaders -Body (To-JsonBody @{
    universityId = $university.id
    name = "Smoke Batch $suffix"
    startsAt = "2026-07-01T09:00:00+05:30"
    endsAt = "2026-09-30T18:00:00+05:30"
    scheduleText = "Monday to Friday, 09:00-11:00 IST"
})

Write-Host "14. Enrol trainer-managed learner placeholder into batch/course"
$studentId = [guid]::NewGuid().ToString()
$enrolment = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/enrolments" -Headers $authHeaders -Body (To-JsonBody @{
    studentId = $studentId
    batchId = $batch.id
    courseId = $course.id
})

Write-Host "15. Assign course to batch"
$assignment = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/courses/$($course.id)/assignments" -Headers $authHeaders -Body (To-JsonBody @{
    batchId = $batch.id
    studentId = $null
})

Write-Host "16. Create approval request"
$approval = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/approvals/requests" -Headers $authHeaders -Body (To-JsonBody @{
    actionCode = "DELETE"
    resourceType = "COURSE"
    resourceId = $course.id
    payloadJson = "{}"
})

Write-Host "17. Approve request"
$approvalResult = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/approvals/requests/$($approval.id)/approve" -Headers $authHeaders -Body (To-JsonBody @{
    reason = "Smoke approval"
})

Write-Host "18. Create notification event record"
$notification = Invoke-RestMethod -Method Post -Uri "$BaseUrl/api/notifications" -Headers $authHeaders -Body (To-JsonBody @{
    sourceEventId = "smoke-$suffix"
    recipient = "learner-$suffix@example.edu"
    channel = "EMAIL"
    subject = "Smoke notification"
    body = "Enterprise LMS smoke notification"
    attachmentRef = $null
})

[PSCustomObject]@{
    loginUser = $login.email
    roleId = $role.id
    permissionId = $permission.id
    effectivePermissionCount = $effective.permissions.Count
    visibleModuleCount = $visibleModules.Count
    universityId = $university.id
    trainerId = $trainer.id
    courseId = $course.id
    batchId = $batch.id
    enrolmentId = $enrolment.id
    courseAssignmentId = $assignment.id
    approvalRequestId = $approval.id
    approvalStatus = $approvalResult.status
    notificationId = $notification.id
    notificationStatus = $notification.status
} | Format-List
