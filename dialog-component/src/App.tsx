import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Dialog from './components/Dialog';
import Button from './components/Button';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'form' | 'alert' | 'confirmation'>('form');

  const openDialog = (type: 'form' | 'alert' | 'confirmation') => {
    setDialogContent(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const renderDialogContent = () => {
    switch (dialogContent) {
      case 'form':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message here"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button onClick={() => { alert('Form submitted!'); closeDialog(); }}>
                Submit
              </Button>
            </div>
          </>
        );
      case 'alert':
        return (
          <>
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Important Notice</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This is an important alert message that requires your attention.
              </p>
            </div>
            <div className="mt-5 sm:mt-6">
              <Button fullWidth onClick={closeDialog}>
                I understand
              </Button>
            </div>
          </>
        );
      case 'confirmation':
        return (
          <>
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10 mb-4 sm:mb-0">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete account</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete your account? All of your data will be permanently removed.
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <Button variant="danger" className="sm:ml-3" onClick={closeDialog}>
                Delete
              </Button>
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="stipling min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
      <div className="amplitude"></div>
      <div className="decoratorBg max-w-md w-full bg-white drop-shadow-xl rounded-lg overflow-hidden">

        <div className="px-6 py-8 bg-black bg-opacity-50">
          <h1 className="text-2xl font-bold text-center text-white mb-6 bg-black bg-opacity-40 py-3">Dynamic Dialog Examples</h1>
          <div className="mb-6 flex justify-center">
            <button className="button71 text-white text-lg font-medium">Gradient Box Btn</button>
          </div>
          <p className="text-white mb-8 text-center bg-black bg-opacity-60 p-3 rounded">
            Click the buttons below to see different dialog examples. Each dialog demonstrates
            different content types and interactions.
          </p>

          <div className="space-y-4 bg-black bg-opacity-60 p-4 rounded">
            <Button
              fullWidth
              onClick={() => openDialog('form')}
              className="flex items-center justify-center"
            >
              <MessageCircle size={18} className="mr-2" />
              Contact Form Dialog
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => openDialog('alert')}
            >
              Alert Dialog
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={() => openDialog('confirmation')}
            >
              Confirmation Dialog
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        title={
          dialogContent === 'form'
            ? 'Contact Us'
            : dialogContent === 'alert'
              ? 'Alert'
              : 'Confirm Action'
        }
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
}

export default App;