export const sendSuccess = (res, statusCode, data, message = null) => {
  const response = {
    success: true,
    data,
  };

  if (message) response.message = message;

  return res.status(statusCode).json(response);
};

export const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: { message },
  });
};

export const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, 201, data, message);
};

export const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, 404, message);
};

export const sendBadRequest = (res, message = 'Bad request') => {
  return sendError(res, 400, message);
};

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, 401, message);
};
