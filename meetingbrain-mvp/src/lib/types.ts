/**
 * Type definitions for GハウスVC加盟店管理システム
 */

export interface Store {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  address: string;
  full_address: string;
  latitude: number | null;
  longitude: number | null;
  joined_date: string;
  created_at: string;
  updated_at: string;
}
