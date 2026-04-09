import { InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';

export const handleError = (error) => {
  if (error instanceof Error) {
    if ('code' in error && error.code === '23505') {
      throw new UnprocessableEntityException(
        'Duplicate entry detected. Please ensure the data is unique.',
      );
    }
    if ('code' in error && error.code === '23503')
      throw new UnprocessableEntityException(
        'Foreign key constraint violation. Please ensure all related entities exist.',
      );
    if (error.message) {
      throw new InternalServerErrorException(error.message);
    }
  }
  throw new InternalServerErrorException('An unexpected error occurred.');
};
