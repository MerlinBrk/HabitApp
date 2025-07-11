

interface HomeProgressCardProps {
    title:string;
    value:string;
    progressbar:boolean;
    icon: boolean;
    description: string;
    percentage: number;
}

export default function HomeProgressCard({title, value, progressbar, icon, description, percentage}: HomeProgressCardProps) {
    return (<div className="rounded-xl border bg-card text-card-foreground shadow md:col-span-1 w-full">
          <div className="flex flex-col space-y-1.5 p-6 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              {title}
            </h3>
          </div>
          
          <div className="p-6 pt-0">
            <div className="flex items-center">
            {icon && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up h-5 w-5 mr-2 text-primary">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
            </svg>)}
            <div className="text-3xl font-bold pb-2">{value}</div>
            </div>
            {              progressbar && (
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-black h-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${percentage}%`,
                }}
              ></div>
            </div>
            
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {description}
              
            </p>
          </div>
        </div>);
}