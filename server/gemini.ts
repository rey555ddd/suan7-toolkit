import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./_core/env";

let _client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!_client) {
    if (!ENV.geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    _client = new GoogleGenerativeAI(ENV.geminiApiKey);
  }
  return _client;
}

export interface GeminiMessage {
  role: "user" | "model";
  content: string;
}

/**
 * 呼叫 Gemini gemini-2.5-flash 模型
 * @param systemPrompt 系統提示詞
 * @param userPrompt 使用者輸入
 * @returns 模型回應文字
 */
export async function invokeGemini(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userPrompt);
  const response = result.response;
  return response.text();
}

/**
 * 呼叫 Gemini 並要求回傳 JSON 格式
 * @param systemPrompt 系統提示詞（應包含 JSON 格式說明）
 * @param userPrompt 使用者輸入
 * @returns 解析後的 JSON 物件
 */
export async function invokeGeminiJSON<T = unknown>(
  systemPrompt: string,
  userPrompt: string
): Promise<T> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(userPrompt);
  const text = result.response.text();
  return JSON.parse(text) as T;
}
