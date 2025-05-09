import { Tag } from '../types';

const LOCAL_STORAGE_KEY = 'museai_tags';

export const tagsService = {
  getLocalTags: (): Tag[] => {
    const tags = localStorage.getItem(LOCAL_STORAGE_KEY);
    return tags ? JSON.parse(tags) : [];
  },

  saveLocalTags: (tags: Tag[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tags));
  },

  createTag: (name: string): Tag => {
    const tags = tagsService.getLocalTags();
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      noteCount: 0
    };
    tags.push(newTag);
    tagsService.saveLocalTags(tags);
    return newTag;
  },

  getOrCreateTag: (name: string): Tag => {
    const tags = tagsService.getLocalTags();
    const existingTag = tags.find(tag => tag.name === name);
    if (existingTag) {
      return existingTag;
    }
    return tagsService.createTag(name);
  },

  incrementTagCount: (tagId: string): void => {
    const tags = tagsService.getLocalTags();
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      tag.noteCount++;
      tagsService.saveLocalTags(tags);
    }
  },

  decrementTagCount: (tagId: string): void => {
    const tags = tagsService.getLocalTags();
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      tag.noteCount--;
      if (tag.noteCount <= 0) {
        // Remove tag if it's no longer used
        const updatedTags = tags.filter(t => t.id !== tagId);
        tagsService.saveLocalTags(updatedTags);
      } else {
        tagsService.saveLocalTags(tags);
      }
    }
  },

  getTagById: (tagId: string): Tag | undefined => {
    const tags = tagsService.getLocalTags();
    return tags.find(tag => tag.id === tagId);
  },

  getTagByName: (name: string): Tag | undefined => {
    const tags = tagsService.getLocalTags();
    return tags.find(tag => tag.name === name);
  }
}; 