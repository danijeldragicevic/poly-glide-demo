// TODO need to find a way how to deploy this via the PolyAPI Glide
// CLI approach gives me some odd message that file does not exists
// Swagger approach does not allow to deploy snippets where there is a line wrap
export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }

  toJSON() {
    return {
      status: this.status,
      statusText: this.statusText,
      message: this.message,
    };
  }
}
