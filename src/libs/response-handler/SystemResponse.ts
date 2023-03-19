import CodeMessage from './CodeMessage';
import StatusCodes from './StatusCodes';

class SystemResponse {
  public static getInstance() {
    return new SystemResponse();
  }
  
  public static success(message, data) {
    return {
      data: data || {},
      message: message || CodeMessage[StatusCodes.SUCCESS],
      status: StatusCodes.SUCCESS,
    };
  }

  public static foundRedirect(message) {
    return SystemResponse.getInstance().getResponse(message, StatusCodes.FOUND);
  }

  public static notModifiedRedirect(message) {
    return SystemResponse.getInstance().getResponse(message, StatusCodes.NOT_MODIFIED);
  }

  public static badRequestError(message, error) {
    return SystemResponse.getInstance().getErrorResponse(message, error, StatusCodes.BAD_REQUEST);
  }

  public static unauthorizedError(message, error) {
    return SystemResponse.getInstance().getErrorResponse(message, error, StatusCodes.UNAUTHORIZED);
  }

  public static forbiddenError(message, error) {
    return SystemResponse.getInstance().getErrorResponse(message, error, StatusCodes.FORBIDDEN);
  }

  public static notFoundError(message, error) {
    return SystemResponse.getInstance().getErrorResponse(message, error, StatusCodes.NOT_FOUND);
  }

  public static methodNotAllowedError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.METHOD_NOT_ALLOWED);
  }

  public static notAcceptableError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.NOT_ACCEPTABLE);
  }

  public static proxyAuthRequiredError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.PROXY_AUTHENTICATION_REQUIRED);
  }

  public static requestTimeoutError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.REQUEST_TIMEOUT);
  }

  public static unprocessableEntityError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.UNPROCESSABLE_ENTITY);
  }

  public static internalServerError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  public static notImplementedError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.NOT_IMPLEMENTED);
  }

  public static badGatewayError(message, error) {
    return SystemResponse.getInstance().getErrorResponse(message, error, StatusCodes.BAD_GATEWAY);
  }

  public static serviceUnavailableError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.SERVICE_UNAVAILABLE);
  }

  public static gatewayTimeoutError(message, error) {
    return SystemResponse.getInstance()
      .getErrorResponse(message, error, StatusCodes.GATEWAY_TIME_OUT);
  }

  public getErrorResponse(message, error, code) {
    return {
      error: error || {},
      message: message || CodeMessage[code],
      status: code,
    };
  }

  public getResponse(message, code) {
    return {
      message: message || CodeMessage[code],
      status: code,
    };
  }
}

export default SystemResponse;
