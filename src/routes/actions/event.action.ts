import { type ActionFunctionArgs } from 'react-router-dom';
import { eventApi } from '../../services/api/event.api';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const createEventAction = async ({ request }: ActionFunctionArgs) => {
  // We expect JSON submission for complex event data
  // This is complex because of nested objects (location, recurringRule) and arrays (photos).
  // If we rely on standard FormData submission from a simple form, we'd need to reconstruct it.
  // OR we can send JSON via useSubmit(data, { method: 'post', encType: 'application/json' })
  // If useSubmit is used with JSON, request.json() should work.
  
  try {
    const contentType = request.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
        data = await request.json();
    } else {
        // Fallback or error if we strictly expect JSON for complex forms
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
