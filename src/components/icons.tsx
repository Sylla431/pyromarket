import type { Icon as PhosphorIcon, IconWeight } from "@phosphor-icons/react";
import {
  BellIcon,
  CameraIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ChatCircleTextIcon,
  CheckIcon,
  ClockIcon,
  ExportIcon,
  FlagIcon,
  GearFineIcon,
  HandshakeIcon,
  IdentificationCardIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PackageIcon,
  PaperPlaneRightIcon,
  PlusIcon,
  RecycleIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SquaresFourIcon,
  StorefrontIcon,
  TruckIcon,
  UserCircleIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

// Icônes de l'interface, tirées de Phosphor (https://phosphoricons.com).
// Graisses : « regular » par défaut, « fill » pour l'onglet actif,
// « duotone » pour les grandes tuiles, « bold » pour les actions fortes.

export type IconProps = {
  size?: number;
  weight?: IconWeight;
  className?: string;
};

function icone(Composant: PhosphorIcon, nom: string) {
  function Icone({ size = 22, weight = "regular", className }: IconProps) {
    return <Composant size={size} weight={weight} className={className} aria-hidden="true" />;
  }
  Icone.displayName = nom;
  return Icone;
}

export const IconMarket = icone(StorefrontIcon, "IconMarket");
export const IconTruck = icone(TruckIcon, "IconTruck");
export const IconGrinder = icone(GearFineIcon, "IconGrinder");
export const IconChat = icone(ChatCircleTextIcon, "IconChat");
export const IconPlus = icone(PlusIcon, "IconPlus");
export const IconBell = icone(BellIcon, "IconBell");
export const IconUser = icone(UserCircleIcon, "IconUser");
export const IconSearch = icone(MagnifyingGlassIcon, "IconSearch");
export const IconSliders = icone(SlidersHorizontalIcon, "IconSliders");
export const IconBack = icone(CaretLeftIcon, "IconBack");
export const IconChevron = icone(CaretRightIcon, "IconChevron");
export const IconPin = icone(MapPinIcon, "IconPin");
export const IconFlag = icone(FlagIcon, "IconFlag");
export const IconCheck = icone(CheckIcon, "IconCheck");
export const IconSend = icone(PaperPlaneRightIcon, "IconSend");
export const IconCamera = icone(CameraIcon, "IconCamera");
export const IconShield = icone(ShieldCheckIcon, "IconShield");
export const IconClock = icone(ClockIcon, "IconClock");
export const IconClose = icone(XIcon, "IconClose");
export const IconShare = icone(ExportIcon, "IconShare");
export const IconRecycle = icone(RecycleIcon, "IconRecycle");
export const IconDashboard = icone(SquaresFourIcon, "IconDashboard");
export const IconUsers = icone(UsersThreeIcon, "IconUsers");
export const IconIdCard = icone(IdentificationCardIcon, "IconIdCard");
export const IconHandshake = icone(HandshakeIcon, "IconHandshake");
export const IconPackage = icone(PackageIcon, "IconPackage");
