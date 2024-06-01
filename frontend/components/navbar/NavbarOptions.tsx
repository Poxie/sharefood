import Button from "../button";

export default function NavbarOptions() {
    return(
        <div className="flex gap-2" data-testid="navbar-options">
            <Button 
                type="transparent"
                className="-my-3"
            >
                Log in
            </Button>
            <Button 
                className="-my-3"
            >
                Sign up
            </Button>
        </div>
    )
}