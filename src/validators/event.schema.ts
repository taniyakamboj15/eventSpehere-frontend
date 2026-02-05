import * as Yup from 'yup';
import { EventCategory, EventVisibility } from '../types/event.types';

export const eventSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  category: Yup.string()
    .oneOf(Object.values(EventCategory), 'Invalid category')
    .required('Category is required'),
  visibility: Yup.string()
    .oneOf(Object.values(EventVisibility), 'Invalid visibility')
    .required('Visibility is required'),
  startDateTime: Yup.string().required('Start date and time is required'),
  endDateTime: Yup.string()
    .required('End date and time is required')
    .test('is-after-start', 'End time must be after start time', function (value) {
      const { startDateTime } = this.parent;
      return !startDateTime || !value || new Date(value) > new Date(startDateTime);
    }),
  location: Yup.object().shape({
    address: Yup.string().required('Address is required'),
    latitude: Yup.number().optional(),
    longitude: Yup.number().optional(),
  }),
  capacity: Yup.number()
    .min(1, 'Capacity must be at least 1')
    .required('Capacity is required'),
  isRecurring: Yup.boolean(),
  communityId: Yup.string()
    .when('visibility', {
      is: EventVisibility.COMMUNITY_ONLY,
      then: (schema) => schema.required('Host Community is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  inviteEmails: Yup.string().when('visibility', {
      is: EventVisibility.PRIVATE_INVITE,
      then: (schema) => schema.required('At least one email is required for private events'),
      otherwise: (schema) => schema.notRequired(),
  }),
  recurringRule: Yup.object().shape({
    frequency: Yup.string().oneOf(['DAILY', 'WEEKLY', 'MONTHLY']),
    interval: Yup.number().min(1),
    endDate: Yup.string(),
  }).when('isRecurring', {
    is: true,
    then: (schema) => schema.shape({
       frequency: Yup.string().required('Frequency is required'),
       interval: Yup.number().required('Interval is required'),
       endDate: Yup.string().required('End date for recurrence is required')
    }),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  photos: Yup.array().of(Yup.string()).optional(),
});

export type EventFormData = Yup.InferType<typeof eventSchema>;
