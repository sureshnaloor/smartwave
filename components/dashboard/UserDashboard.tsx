import { Session } from "next-auth";
import { Button } from '@/components/ui/button';

interface UserDashboardProps {
  session: Session;
}

export default function UserDashboard({ session }: UserDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center pt-24 p-8">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-gray-900/50 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Welcome Back, {session.user?.name || session.user?.email}!
        </h1>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <p className="text-blue-800 dark:text-blue-200 text-center text-lg">
            🚧 Under Construction 🚧
          </p>
          <p className="text-blue-600 dark:text-blue-300 text-center mt-2">
            We're building your personalized dashboard where you'll be able to manage your vCard, 
            digital card, and SmartWave profile.
          </p>
        </div>
        <div className="grid gap-4 text-center">
          <Button 
            variant="outline" 
            className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled
          >
            Create vCard (Coming Soon)
          </Button>
          <Button 
            variant="outline"
            className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled
          >
            Generate Digital Card (Coming Soon)
          </Button>
          <Button 
            variant="outline"
            className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled
          >
            Setup SmartWave Profile (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
} 