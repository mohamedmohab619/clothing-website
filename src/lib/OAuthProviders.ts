import { DiscordIcon, GitHubIcon } from "@/components/auth/OAuthIcons";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["discord", "github"] as const;
export type supportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  supportedOAuthProvider,
  { name: string, Icon: ElementType<ComponentProps<'svg'>> }
> = {
  discord: {
    name: 'Discord',
    Icon: DiscordIcon
  },
  github: {
    name: 'GitHub',
    Icon: GitHubIcon
  }
}
