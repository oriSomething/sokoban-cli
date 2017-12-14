import axios from "axios";
import { parse } from "./parse";

export async function getLevelsFromUrl(url: string) {
  const response = await axios.get(url, {
    responseType: "text",
  });
  return parse(response.data);
}
