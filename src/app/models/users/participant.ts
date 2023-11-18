import { ParticipantRole } from "src/app/enums/participant-role";

export class ParticipantModel {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  participantRoleId: ParticipantRole;
}
