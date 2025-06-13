import { SERVER_URL } from "@env";
import axios from "axios";

("/prospect/manage");

export async function getActiveProspects() {
  try {
    const { data } = await axios.get(`${SERVER_URL}/prospect/manage`);
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
    return [];
  }
}
export async function getProspect(id: string) {
  try {
    const { data } = await axios.get(`${SERVER_URL}/prospect/manage/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
    return {};
  }
}
export async function postProspect(prospectData: any) {
  try {
    const { data } = await axios.post(
      `${SERVER_URL}/prospect/manage`,
      prospectData
    );
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
  }
}
export async function updateProspect(id: string, prospectData: any) {
  try {
    const { data } = await axios.put(
      `${SERVER_URL}/prospect/manage/${id}`,
      prospectData
    );
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
  }
}
export async function deleteProspect(id: string) {
  try {
    const { data } = await axios.delete(`${SERVER_URL}/prospect/manage/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
  }
}
