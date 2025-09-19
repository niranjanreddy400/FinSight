@@ .. @@
 import React, { useState } from 'react';
-import { useAuth } from '../../hooks/useAuth';
+import { useAuth, DEMO_CREDENTIALS } from '../../hooks/useAuth';
 import { Eye, EyeOff, Mail, Lock, User, LogIn } from 'lucide-react';
 
 export const AuthForm: React.FC = () => {
@@ .. @@
           <h1 className="text-3xl font-bold text-gray-900 mb-2">FinSight</h1>
           <p className="text-gray-600">Smart Financial Tracking & Analytics</p>
         </div>
+
+        {/* Demo Credentials Info */}
+        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
+          <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Mode Available</h3>
+          <p className="text-xs text-blue-700 mb-2">Test the app without creating an account:</p>
+          <div className="bg-white rounded p-2 text-xs font-mono">
+            <div>Email: <span className="text-blue-600">{DEMO_CREDENTIALS.email}</span></div>
+            <div>Password: <span className="text-blue-600">{DEMO_CREDENTIALS.password}</span></div>
+          </div>
+          <button
+            type="button"
+            onClick={() => {
+              setEmail(DEMO_CREDENTIALS.email);
+              setPassword(DEMO_CREDENTIALS.password);
+            }}
+            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
+          >
+            Click to auto-fill demo credentials
+          </button>
+        </div>
 
         <div className="space-y-6">
           <div className="flex border-b border-gray-200">
@@ .. @@
           </div>
         </div>
       </div>
     </div>
   );
 };