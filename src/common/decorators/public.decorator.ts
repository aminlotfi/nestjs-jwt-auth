import {SetMetadata} from "@nestjs/common";

// The Public decorator is used to mark a route as public.
// SetMetadata() is a built-in NestJS function that adds metadata to a route.
export const Public = () => SetMetadata('isPublic', true);