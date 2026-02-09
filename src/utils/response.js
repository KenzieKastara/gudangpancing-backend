/**
 * Send success response
 */
export function successResponse(reply, data, message = 'Success', statusCode = 200) {
  return reply.code(statusCode).send({
    success: true,
    message,
    data
  });
}

/**
 * Send error response
 */
export function errorResponse(reply, message = 'Error occurred', statusCode = 500, errors = null) {
  return reply.code(statusCode).send({
    success: false,
    message,
    errors
  });
}
