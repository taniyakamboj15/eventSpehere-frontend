export interface ProfileFormData {
  name: string;
  email: string;
}

export interface CreateCommunityForm {
  name: string;
  type: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
}
