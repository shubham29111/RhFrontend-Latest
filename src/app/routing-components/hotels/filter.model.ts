export interface FilterItem {
    type: string | null;
    category: string;
    count: string;
  }
  
  export interface Technology {
    name: string;
    id: string;
    count: string;
  }
  
  export interface FilterGroup {
    groupName: string;
    category: string;
    technologies?: Technology[];
    subGroups?: { subGroupName: string; technologies: Technology[] }[];
  }
  
export interface FilterItem {
  type: string | null;
  category: string;
  count: string;
}
