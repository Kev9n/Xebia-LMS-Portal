const CLOUDINARY_HOST = "res.cloudinary.com";

const DOCUMENT_EXTENSIONS = new Set(["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"]);

function getUrlExtension(url) {
  if (!url || typeof url !== "string") return "";

  const cleanUrl = url.split("#")[0].split("?")[0];
  const lastSegment = cleanUrl.split("/").pop() || "";
  const parts = lastSegment.split(".");

  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

function isCloudinaryUrl(url) {
  return typeof url === "string" && url.includes(CLOUDINARY_HOST);
}

export function isDocumentUrl(url) {
  return DOCUMENT_EXTENSIONS.has(getUrlExtension(url));
}

export function getCloudinaryAssetUrl(uploadResult) {
  if (!uploadResult) return "";

  const { secure_url: secureUrl } = uploadResult;

  if (!secureUrl) return "";

  return secureUrl;
}

function createDocumentPreviewUrl(url, format = "jpg") {
  if (!isCloudinaryUrl(url) || !isDocumentUrl(url)) {
    return url;
  }

  const fileFormat = format.toLowerCase();
  const imageStyleUrl = url.replace(/\/(?:image|video|raw)\/upload\//, "/image/upload/");

  const urlParts = imageStyleUrl.split("/upload/");
  if (urlParts.length !== 2) {
    return imageStyleUrl;
  }

  const [prefix, suffix] = urlParts;
  const withoutQuery = suffix.split("?")[0].split("#")[0];
  const segments = withoutQuery.split("/");
  const fileName = segments.pop() || "";
  const publicId = fileName.replace(/\.[^.]+$/, "");
  const versionSegment = segments.pop() || "";
  const folderPath = segments.length ? `${segments.join("/")}/` : "";
  const versionAndPath = [
    versionSegment,
    folderPath
      ? `${folderPath}${publicId}.${fileFormat}`
      : publicId
        ? `${publicId}.${fileFormat}`
        : "",
  ]
    .filter(Boolean)
    .join("/");

  return `${prefix}/upload/pg_1,f_${fileFormat}/${versionAndPath}`;
}

export function normalizeCloudinaryDocumentUrl(url) {
  if (!isCloudinaryUrl(url) || !isDocumentUrl(url)) {
    return url;
  }

  return url.replace(/\/raw\/upload\//, "/image/upload/");
}

export function getCloudinaryDocumentPreviewUrl(url) {
  return createDocumentPreviewUrl(normalizeCloudinaryDocumentUrl(url), "jpg");
}
