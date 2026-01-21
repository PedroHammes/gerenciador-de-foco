import Link from "next/link";
import { 
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "../ui/navigation-menu";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <div className="
    flex items-center justify-between
    ">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="#timely" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>TimeLy</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#features" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Funcionalidades</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#pricing" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Planos</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#support" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Suporte</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="#social" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Contato</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="
      flex gap-4
      ">
        <Button variant={"outline"}>
          Entre
        </Button>
        <Button variant={"default"}>
          Cadastre-se
        </Button>
      </div>
    </div>

  )
}