import type { LoaderFunctionArgs } from 'react-router-dom';
import { communityApi } from '../../services/api/community.api';

export const communityDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) throw new Error("Community ID is required");

  // Fetch details and events in parallel
  const [community, events, members] = await Promise.all([
    communityApi.getById(id),
    communityApi.getEvents(id),
    communityApi.getMembers(id)
  ]);

  return { community, events, members };
};
