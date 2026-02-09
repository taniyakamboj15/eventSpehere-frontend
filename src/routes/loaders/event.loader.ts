import { type LoaderFunctionArgs } from 'react-router-dom';
import { eventApi } from '../../services/api/event.api';

export const eventDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) {
    throw new Response("Event ID is required", { status: 400 });
  }
  
  const eventPromise = eventApi.getById(id);
  
  return {
    event: eventPromise,
  };
};
