import axiosInstance from "../api/axios";

export async function saveTemplate(landingPageId, name, snapshot, versionId = null) {
  try {
    if (versionId) {
      // UPDATE EXISTING VERSION
      const res = await axiosInstance.put(
        `/landing/update-template/${versionId}`,
        { name, snapshot }
      );
      return res.data;
    }

    // CREATE NEW VERSION
    const res = await axiosInstance.post(
      `/landing/save-template/${landingPageId}`,
      { name, snapshot }
    );
    return res.data;

  } catch (err) {
    console.error("❌ saveTemplate error:", err);
    return { success: false };
  }
}

export async function loadTemplateVersions(landingPageId) {
  try {
    const res = await axiosInstance.get(
      `/landing/templates/${landingPageId}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ loadTemplateVersions error:", err);
    return { success: false, templates: [] };
  }
}

export async function fetchTemplateSnapshot(versionId) {
  try {
    const res = await axiosInstance.get(
      `/landing/load-template/${versionId}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ fetchTemplateSnapshot error:", err);
    return { success: false };
  }
}

export async function restoreTemplate(landingPageId, snapshot) {
  try {
    const res = await axiosInstance.put(
      `/landing/restore-template/${landingPageId}`,
      { snapshot }
    );
    return res.data;
  } catch (err) {
    console.error("❌ restoreTemplate error:", err);
    return { success: false };
  }
}

export async function deleteTemplate(versionId) {
  try {
    const res = await axiosInstance.delete(`/landing/delete-template/${versionId}`);
    return res.data;
  } catch (err) {
    console.error("❌ deleteTemplate error:", err);
    return { success: false };
  }
}
