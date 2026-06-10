"use client";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { Envelope, Phone, DeviceMobile, Buildings, DotsThreeVertical } from "@phosphor-icons/react";
import { OWNER_AVATARS } from "@/lib/avatars";

interface Contact {
  id: number; firstName: string; lastName: string;
  ownerName: string; ownerInitials: string;
  email: string; phone: string; mobile: string;
  accountName: string;
}

const AVATAR_PAL = ["#0C2472", "#1D4ED8", "#3B82F6", "#60A5FA"];
const avatarColor = (n: string) => AVATAR_PAL[n.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_PAL.length];
const initials    = (first: string, last: string) => ((first[0] || "") + (last[0] || "")).toUpperCase();

// Soft pastel fills + coordinating deep accents — alternated card-to-card
const PASTELS = [
  { fill: "#D6E4F9", deep: "#2F6FED" },
  { fill: "#D0E5E0", deep: "#2E9E7B" },
  { fill: "#FAE3D0", deep: "#E0883F" },
  { fill: "#F5D9E1", deep: "#DB5E8C" },
  { fill: "#D2DFF0", deep: "#5B6CB5" },
];

interface Props { contacts: Contact[] }

export default function ContactGridView({ contacts }: Props) {
  const router = useRouter();

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <p className="font-heading text-sm font-semibold">No contacts found</p>
        <p className="text-xs mt-1">Adjust filters or add a new contact</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {contacts.map((contact, i) => {
        const fullName = `${contact.firstName} ${contact.lastName}`.trim();
        const avCol    = avatarColor(fullName);
        const avInit   = initials(contact.firstName, contact.lastName);
        const owCol    = avatarColor(contact.ownerName);

        // Alternate: even cards pastel (cycling palette), odd cards clean white
        const colored = i % 2 === 0;
        const theme   = colored ? PASTELS[(i / 2) % PASTELS.length] : { fill: "#f9fbff", deep: "#3B82F6" };

        return (
          <div
            key={contact.id}
            onClick={() => router.push(`/contacts/${contact.id}`)}
            className={`rounded-2xl border ${colored ? "border-white/50" : "border-[#E3ECFC]"} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden`}
            style={{ backgroundColor: theme.fill, boxShadow: "0 6px 24px rgba(15,23,42,0.06)" }}
          >
            <div className="p-4">
              {/* Avatar + Name + Menu */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar sx={{ width: 44, height: 44, bgcolor: avCol, fontSize: "0.85rem", fontWeight: 800, flexShrink: 0, boxShadow: "0 2px 8px rgba(12,36,114,0.15)" }}>
                  {avInit}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-[13.5px] font-bold text-[#0C2472] truncate transition-colors">
                    {fullName}
                  </p>
                  {contact.accountName && (
                    <p className="text-[11px] text-slate-600 truncate flex items-center gap-1 mt-0.5">
                      <Buildings size={10} color={theme.deep} weight="duotone" />
                      {contact.accountName}
                    </p>
                  )}
                </div>
                <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#f9fbff]/60">
                  <DotsThreeVertical size={15} color="#475569" weight="duotone" />
                </button>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5">
                {contact.email ? (
                  <div className="flex items-center gap-2 text-[11.5px] text-slate-700">
                    <Envelope size={12} color={theme.deep} weight="duotone" className="flex-shrink-0" />
                    <span className="truncate font-medium">{contact.email}</span>
                  </div>
                ) : null}
                {contact.phone ? (
                  <div className="flex items-center gap-2 text-[11.5px] text-slate-600 font-mono">
                    <Phone size={12} color={theme.deep} weight="duotone" className="flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                ) : null}
                {contact.mobile ? (
                  <div className="flex items-center gap-2 text-[11.5px] text-slate-600 font-mono">
                    <DeviceMobile size={12} color={theme.deep} weight="duotone" className="flex-shrink-0" />
                    <span>{contact.mobile}</span>
                  </div>
                ) : null}
                {!contact.email && !contact.phone && !contact.mobile && (
                  <p className="text-[11px] text-slate-400 italic">No contact info</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center gap-2 px-4 py-2.5 border-t ${colored ? "border-white/50 bg-[#f9fbff]/30" : "border-[#EFF6FF] bg-[#EFF6FF]"}`}>
              <Tooltip title={contact.ownerName}>
                <div className="flex items-center gap-1.5">
                  <Avatar src={OWNER_AVATARS[contact.ownerName]} sx={{ width: 20, height: 20, bgcolor: owCol, fontSize: "0.48rem", fontWeight: 800 }}>
                    {contact.ownerInitials}
                  </Avatar>
                  <span className="text-[10.5px] text-slate-600 font-medium">{contact.ownerName}</span>
                </div>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
}
