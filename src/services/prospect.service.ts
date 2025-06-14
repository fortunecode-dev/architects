import { SERVER_URL } from "@env";
import axios from "axios";

("/prospect/manage");

export async function getActiveProspects() {
  try {
    const { data } = await axios.get(`${SERVER_URL}/prospect/manage`);
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
    return [
      {
        id: "ee068a75-a9ec-4aaa-add3-c79c91d1b46a",
        name: "prospect test",
        lastName: " test last name",
        address: "test address",
        email: "test email",
        phone: "test phone",
        state: " test state",
        city: "test city",
        postal: null,
        metadata: {},
        deleted: null,
        attended: null,
      },
    ];
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
export async function postQuestion(prospectData: any) {
  try {
    const { data } = await axios.post(
      `${SERVER_URL}/prospect/question`,
      prospectData
    );
    return data;
  } catch (error) {
    console.error("Error fetching prospect URL:", error);
  }
}
export async function postAnswer(answerData: any) {
  try {
    const { data } = await axios.put(
      `${SERVER_URL}/prospect/answer`,
      answerData
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
