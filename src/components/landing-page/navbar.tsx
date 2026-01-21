"use client";

import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between w-full p-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <NavigationMenu>
        <NavigationMenuList>
          
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#timely" className={navigationMenuTriggerStyle()}>
                TimeLy
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#features" className={navigationMenuTriggerStyle()}>
                Funcionalidades
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#pricing" className={navigationMenuTriggerStyle()}>
                Planos
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#support" className={navigationMenuTriggerStyle()}>
                Suporte
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a href="#social" className={navigationMenuTriggerStyle()}>
                Contato
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>

        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <a href="/signin">
            Entre
          </a>
        </Button>
        <Button variant="default" asChild>
          <a href="/signup">
            Cadastre-se
          </a>
        </Button>
      </div>
    </div>
  )
}