import api from "./axios";

export async function startLeadMagnetEdit(id) {
  try {
    const res = await api.post(
      `/edit/${id}/editor/start`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error starting lead magnet edit:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error || "Failed to start editor session."
    );
  }
}

export async function commitLeadMagnetEdit(id, token, updatedHtml) {
  try {
    const res = await api.put(
      `/edit/${id}/editor/commit`,
      { token, updatedHtml }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error committing lead magnet edit:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.error || "Failed to save edited PDF."
    );
  }
}