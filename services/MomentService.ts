import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, DEFAULT_CATEGORIES, Moment } from "../types";

const MOMENTS_KEY = "@mademesmile:moments";
const CATEGORIES_KEY = "@mademesmile:categories";

export class MomentService {
  // Get all moments
  static async getMoments(): Promise<Moment[]> {
    try {
      const momentsJson = await AsyncStorage.getItem(MOMENTS_KEY);
      if (momentsJson) {
        const moments = JSON.parse(momentsJson);
        return moments.map((moment: any) => ({
          ...moment,
          createdAt: new Date(moment.createdAt),
          updatedAt: new Date(moment.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error getting moments:", error);
      return [];
    }
  }

  // Save a moment
  static async saveMoment(
    moment: Omit<Moment, "id" | "createdAt" | "updatedAt">
  ): Promise<Moment> {
    try {
      const moments = await this.getMoments();
      const newMoment: Moment = {
        ...moment,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      moments.unshift(newMoment); // Add to beginning for chronological order
      await AsyncStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
      return newMoment;
    } catch (error) {
      console.error("Error saving moment:", error);
      throw error;
    }
  }

  // Update a moment
  static async updateMoment(
    id: string,
    updates: Partial<Moment>
  ): Promise<Moment | null> {
    try {
      const moments = await this.getMoments();
      const index = moments.findIndex((moment) => moment.id === id);

      if (index === -1) return null;

      moments[index] = {
        ...moments[index],
        ...updates,
        updatedAt: new Date(),
      };

      await AsyncStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
      return moments[index];
    } catch (error) {
      console.error("Error updating moment:", error);
      throw error;
    }
  }

  // Delete a moment
  static async deleteMoment(id: string): Promise<boolean> {
    try {
      const moments = await this.getMoments();
      const filteredMoments = moments.filter((moment) => moment.id !== id);
      await AsyncStorage.setItem(MOMENTS_KEY, JSON.stringify(filteredMoments));
      return true;
    } catch (error) {
      console.error("Error deleting moment:", error);
      return false;
    }
  }

  // Get moments by category
  static async getMomentsByCategory(category: string): Promise<Moment[]> {
    try {
      const moments = await this.getMoments();
      return moments.filter((moment) => moment.category === category);
    } catch (error) {
      console.error("Error getting moments by category:", error);
      return [];
    }
  }

  // Get moments by collection
  static async getMomentsByCollection(collection: string): Promise<Moment[]> {
    try {
      const moments = await this.getMoments();
      return moments.filter((moment) => moment.collection === collection);
    } catch (error) {
      console.error("Error getting moments by collection:", error);
      return [];
    }
  }

  // Search moments
  static async searchMoments(query: string): Promise<Moment[]> {
    try {
      const moments = await this.getMoments();
      const lowercaseQuery = query.toLowerCase();

      return moments.filter(
        (moment) =>
          moment.content.toLowerCase().includes(lowercaseQuery) ||
          moment.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error("Error searching moments:", error);
      return [];
    }
  }

  // Get categories
  static async getCategories(): Promise<Category[]> {
    try {
      const categoriesJson = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (categoriesJson) {
        return JSON.parse(categoriesJson);
      }
      // Return default categories if none exist
      await this.saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    } catch (error) {
      console.error("Error getting categories:", error);
      return DEFAULT_CATEGORIES;
    }
  }

  // Save categories
  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Error saving categories:", error);
      throw error;
    }
  }

  // Get moment statistics
  static async getMomentStats(): Promise<{
    totalMoments: number;
    momentsThisWeek: number;
    momentsThisMonth: number;
    categoryCounts: Record<string, number>;
    collectionCounts: Record<string, number>;
  }> {
    try {
      const moments = await this.getMoments();
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const momentsThisWeek = moments.filter(
        (moment) => moment.createdAt >= weekAgo
      ).length;
      const momentsThisMonth = moments.filter(
        (moment) => moment.createdAt >= monthAgo
      ).length;

      const categoryCounts: Record<string, number> = {};
      const collectionCounts: Record<string, number> = {};
      moments.forEach((moment) => {
        categoryCounts[moment.category] =
          (categoryCounts[moment.category] || 0) + 1;
        if (moment.collection) {
          collectionCounts[moment.collection] =
            (collectionCounts[moment.collection] || 0) + 1;
        }
      });

      return {
        totalMoments: moments.length,
        momentsThisWeek,
        momentsThisMonth,
        categoryCounts,
        collectionCounts,
      };
    } catch (error) {
      console.error("Error getting moment stats:", error);
      return {
        totalMoments: 0,
        momentsThisWeek: 0,
        momentsThisMonth: 0,
        categoryCounts: {},
        collectionCounts: {},
      };
    }
  }
}
