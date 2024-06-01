import { differenceInYears, format, formatDistanceToNow } from "date-fns";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

export function calcAge(dob: Date) {
  return differenceInYears(new Date(), dob);
}

export function formatShortDateTime(date: Date) {
  return format(date, "dd MMM yy h:mm:a");
}

export function timeAgo(data: string) {
  return formatDistanceToNow(new Date(data), { addSuffix: true });
}

export function handleFormServerErrors<TFieldValues extends FieldValues>(
  errorResponse: { error: string | ZodIssue[] },
  setError: UseFormSetError<TFieldValues>
) {
  if (Array.isArray(errorResponse.error)) {
    errorResponse.error.forEach((err) => {
      const fieldName = err.path.join(".") as Path<TFieldValues>;

      setError(fieldName, { message: err.message });
    });
  } else {
    setError("root.serverError", { message: errorResponse.error });
  }
}

export function transformImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return null;

  if (!imageUrl.includes("cloudinary")) return imageUrl;

  const uploadIndex = imageUrl.indexOf("upload/") + "upload/".length;

  const transformedUrl = "c_fill,g_face,r_max,w_300,h_300/";

  return `${imageUrl.slice(0, uploadIndex)}${transformedUrl}${imageUrl.slice(
    uploadIndex
  )}`;
}

export function createChatId(a: string, b: string) {
  return a > b ? `${b}-${a}` : `${a}-${b}`;
}
