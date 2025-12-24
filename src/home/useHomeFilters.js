import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useHomeFilters = () => {
    const [category, setCategory] = useState("All");
    const [dealType, setDealType] = useState("All");
    const [location, setLocation] = useState("Toute la tunisie");

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const params = {};
        if (dealType !== "All") params.dealType = dealType;
        if (location !== "Toute la tunisie") params.location = location;
        if (category !== "All") params.category = category;

        setSearchParams(params);
    }, [dealType, location, category]);

    return {
        category,
        setCategory,
        dealType,
        setDealType,
        location,
        setLocation,
    };
};
