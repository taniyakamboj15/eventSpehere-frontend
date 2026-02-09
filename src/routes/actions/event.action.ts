import { type ActionFunctionArgs } from 'react-router-dom';
import { eventApi } from '../../services/api/event.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const createEventAction = async ({ request }: ActionFunctionArgs) => {
  try {
    const contentType = request.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await request.json();
    } else {
        throw new Error("JSON submission required for complex event data");
    }

    await eventApi.create(data);
    toast.success('Event created successfully');
    return { success: true };
  } catch (error: unknown) {
      if (error instanceof AxiosError) {
          return { error: error.response?.data?.message || 'Failed to create event' };
      }
      return { error: 'An unexpected error occurred' };
  }
};

export const editEventAction = async ({ request, params }: ActionFunctionArgs) => {
    const { id } = params;
    if (!id) throw new Error("Event ID is required");

    try {
        const contentType = request.headers.get("Content-Type");
        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await request.json();
        } else {
             throw new Error("JSON submission required for complex event data");
        }

        await eventApi.update(id, data);
        toast.success('Event updated successfully');
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            return { error: error.response?.data?.message || 'Failed to update event' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
