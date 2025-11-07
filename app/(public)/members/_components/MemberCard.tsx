
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Member } from "@/lib/types";

interface MemberCardProps {
  member: Member;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="group relative transform transition-transform duration-300 hover:scale-[1.03]">
      <Card className="overflow-hidden shadow-md transition-all duration-300">
        <div className="relative w-full h-64">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover group-hover:opacity-80 transition-opacity duration-300"
          />
        </div>

        <CardContent className="p-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            {member.name}
          </h3>
        </CardContent>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white">
          <p className="text-sm mb-3">{member.role}</p>
          <div className="flex gap-4">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {member.twitter && (
              <a
                href={member.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
