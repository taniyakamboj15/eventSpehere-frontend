import { eventApi } from '../../services/api/event.api';
import { communityApi } from '../../services/api/community.api';

export const dashboardLoader = async () => {
  // Fetch data in parallel as promises
  const eventsPromise = eventApi.getAll({ limit: 5, time: 'UPCOMING' });
  const communitiesPromise = communityApi.getAll({ memberId: 'me' });
  
  return {
    events: eventsPromise,
    communities: communitiesPromise
  };
};
