import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";

export interface Member {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

interface Props {
    members: Member[]; // List of all members to search from
    onSelectMembers: (selectedEmails: string[]) => void; // Now returning only selected emails
}

const AutoCompleteSearch: React.FC<Props> = ({ members, onSelectMembers }) => {
    const [search, setSearch] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    // Filter members based on search input
    const filteredMembers = members.filter(
        (member) =>
            member.name.toLowerCase().includes(search.toLowerCase()) &&
            !selectedMembers.some((selected) => selected.email === member.email)
    );

    // Add selected member
    const handleSelect = (member: Member) => {
        const updatedMembers = [...selectedMembers, member];
        setSelectedMembers(updatedMembers);
        onSelectMembers(updatedMembers.map((m) => m.email)); // Pass only emails
        setSearch(""); // Clear search input
        setHighlightedIndex(0); // Reset highlight index
    };

    // Remove member
    const handleRemove = (email: string) => {
        const updatedMembers = selectedMembers.filter((member) => member.email !== email);
        setSelectedMembers(updatedMembers);
        onSelectMembers(updatedMembers.map((m) => m.email)); // Pass only emails
    };

    // Handle keydown events for arrow navigation and enter selection
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (filteredMembers.length === 0) return;

        if (e.key === "ArrowDown") {
            setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredMembers.length);
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prevIndex) =>
                prevIndex === 0 ? filteredMembers.length - 1 : prevIndex - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredMembers[highlightedIndex]) {
                handleSelect(filteredMembers[highlightedIndex]);
            }
        }
    };

    useEffect(() => {
        setHighlightedIndex(0);
    }, [search]); // Reset highlighted index when search input changes

    return (
        <div>
            {/* Selected members display */}
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedMembers.map((member) => (
                    <div key={member.email} className="bg-[#0a0a0a] text-white px-2 py-1 rounded-md flex items-center gap-2">
                        {member.name}
                        <Button size="sm" onClick={() => handleRemove(member.email)}>×</Button>
                    </div>
                ))}
            </div>

            {/* Search input */}
            <Input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown} // Capture keyboard events
            />

            {/* Suggestions dropdown */}
            {search && filteredMembers.length > 0 && (
                <ul className="border mt-1 rounded-md bg-white shadow-md">
                    {filteredMembers.map((member, index) => (
                        <li
                            key={member.email}
                            onClick={() => handleSelect(member)}
                            className={`p-2 cursor-pointer ${
                                index === highlightedIndex ? "bg-gray-300" : "hover:bg-gray-200"
                            }`}
                        >
                            {member.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoCompleteSearch;
