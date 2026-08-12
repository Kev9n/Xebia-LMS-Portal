package com.xebia.lms.course.dto;

public class EnrollmentStatusResponse {
    private boolean isEnrolled;

    public EnrollmentStatusResponse() {}

    public EnrollmentStatusResponse(boolean isEnrolled) {
        this.isEnrolled = isEnrolled;
    }

    public boolean getIsEnrolled() {
        return isEnrolled;
    }

    public void setIsEnrolled(boolean isEnrolled) {
        this.isEnrolled = isEnrolled;
    }
}
