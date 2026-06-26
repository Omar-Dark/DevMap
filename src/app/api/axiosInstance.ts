import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const RoadmapApiAxiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "x-api-key":apiKey
  },
});

//Request Interceptor
RoadmapApiAxiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//Response Interceptor

RoadmapApiAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const isSilent = (
      error.config as InternalAxiosRequestConfig & { _silentAuth?: boolean }
    )?._silentAuth;

    if (process.env.NODE_ENV === "development") {
      console.error({ error });
      console.error("❌ API Error:", error.response || error.message);
    }

    if (status === 401 && !isSilent) {
      console.warn("Unauthorized - maybe redirect to login");
    }

    if (status === 403) {
      console.warn("Forbidden - invalid API key?");
    }

    if (status === 500) {
      console.error("Internal server error");
    }

    return Promise.reject(
      error.response?.data || {
        message: error.message,
      },
    );
  },
);

export default RoadmapApiAxiosInstance;
