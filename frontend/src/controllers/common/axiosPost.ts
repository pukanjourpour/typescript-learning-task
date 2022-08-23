import axios from "axios";

export async function axiosPost<requestType, responseType>(
  url: string,
  request: requestType
): Promise<responseType | null> {
  let result: responseType | null = null;
  try {
    const response = await axios.post<responseType>(url, request, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    result = response.data;
  } catch (err) {
    console.log(err);
  }
  return result;
}
