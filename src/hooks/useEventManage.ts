import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api/event.api';
import type { IEvent } from '../types/event.types';

export const useEventManage = (id: string | undefined) => {
    const navigate = useNavigate();
    const [event, setEvent] = useState<IEvent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'details' | 'attendees'>('details');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const data = await eventApi.getById(id);
                setEvent(data);
            } catch (error) {
                console.error('Failed to fetch event', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleDelete = async () => {
        if (!event) return;
        try {
            setIsDeleting(true);
            await eventApi.delete(event._id);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to delete event', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return {
        event,
        isLoading,
        activeTab,
        setActiveTab,
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,
        navigate
    };
};
