"use client";

import { useCategoryStore } from "@/store/category.store";
import { useEffect } from "react";

const Initialize = () => {
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  useEffect(() => {
    const initialize = async () => {
      fetchCategories();
    };

    initialize();
  }, []);
  return <></>;
}

export default Initialize