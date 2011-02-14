/*
 Copyright (c) 2008, 2009, 2011 Lee Barney
 Permission is hereby granted, free of charge, to any person obtaining a 
 copy of this software and associated documentation files (the "Software"), 
 to deal in the Software without restriction, including without limitation the 
 rights to use, copy, modify, merge, publish, distribute, sublicense, 
 and/or sell copies of the Software, and to permit persons to whom the Software 
 is furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software.
 
 The end-user documentation included with the redistribution, if any, must 
 include the following acknowledgment: 
 "This product was created using the QuickConnect framework.  http://quickconnect.sourceforge.net/", 
 in the same place and form as other third-party acknowledgments.   Alternately, this acknowledgment 
 may appear in the software itself, in the same form and location as other 
 such third-party acknowledgments.
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 
 */
package org.quickconnect;

import java.util.ArrayList;
import java.util.HashMap;

import android.os.Handler;
/**
 * The QuickConnect class is used to create control stacks and execute them.  Control stacks 
 * consist a few types of objects that all implement the ControlObject interface.  These types are:
 * <ol>
 * <li><b>ValCO</b> Validation Control Objects - these stacks objects are used to validate values that will be used later in other
 *  control objects.  The items validated are usually passed in as parameters.  By convention names for objects of this type end with ValCO.</li>
 * <li><b>BCO</b> Business Control Objects - these stack objects are used to interact with databases, remote servers, files, and are 
 * also used to do data manipulation/computation.  By convention names for objects of this type end with BCO.</li>
 * <li><b>VCO</b>View Control Objects - these stack objects are used to do user interface updates.</li>
 * <li><b>ECO</b>Error Control Objects - these stack objects are used to notify the user of errors and do any view cleanup required if 
 * an bad data or an error/exception occurs during the execution of a stack.  By convention names for objects of this type end with VCO.</li>
 * </ol>
 * 
 * An example of a login stack could include the following control objects:
 * <ul>
 * <li><b>CredentialsValCO</b> - the handleIt method performs length/content validation on the user name and password.  Returns either true or false</li>
 * <li><b>GetUserCO</b> - the handleIt method queries the database to see if a user exists with the validated user name and password. Returns the user, if any, or null.</li>
 * <li><b>LoginSuccessVCO</b> - the handleIt method updates the UI.</li>
 * @author Lee S. Barney
 *
 */
public class QuickConnect {
	
	private static HashMap<String, ArrayList<ControlObject> > validationMap;
	private static HashMap<String, ArrayList<ControlObject> > businessMap;
	private static HashMap<String, ArrayList<ControlObject> > viewMap;
	private static HashMap<String, ArrayList<ControlObject> > errorMap;
	private static Object theHandler;
	private static boolean handlerAttempted = false;
	
	static{
		validationMap = new HashMap<String, ArrayList<ControlObject>>();
		businessMap = new HashMap<String, ArrayList<ControlObject>>();
		viewMap = new HashMap<String, ArrayList<ControlObject>>();
		errorMap = new HashMap<String, ArrayList<ControlObject>>();
	}
	/**
	 * This method is the Control Object trigger.  Call it from anywhere in your code to execute any stack created using 
	 * the mapCommandTo** methods.  
	 * @param command - the command string that is the key associated with the desired Command Object stack.
	 * @param parameters - an ArrayList containing any values you wish to pass to all Command Objects' in the stack.  
	 * This ArrayList appears as the 'paramters' value passed into all Command Objects in the stack.
	 */
	public static void handleRequest(String command, ArrayList<Object> parameters){
		if(theHandler == null && !handlerAttempted){
			try{
				Class handlerClass = Class.forName("android.os.Handler");
				handlerAttempted = true;
				theHandler = handlerClass.newInstance();
			}
			catch(Exception e){
				
			}
		}
		try{
			Class.forName("javax.servlet.GenericServlet");
			//is enterprise Java if no exception thrown
			new QCRequestHandler(command, parameters, null).run();
		}
		catch(Exception e){
			//is not enterprise Java
			Thread requestHandlingThread = null;
			if(theHandler != null){
				//must be android
				requestHandlingThread = new Thread(new QCRequestHandler(command, parameters, (android.os.Handler) theHandler));
			}
			else{
				requestHandlingThread = new Thread(new QCRequestHandler(command, parameters, null));
			}
			requestHandlingThread.start();
		}
	}
	/**
	 * This method is similar to handleRequest but is used to trigger stacks made of Error Control Objects.  Call it from 
	 * anywhere in your code where you wish to trigger a specified error handling stack.  It is common to call this method from 
	 * within Validation Control Objects if validation fails prior to returning false to terminate execution of the stack.  It 
	 * is also common to call this method from within Business Control Objects when data retrieved from remote sources or local 
	 * databases is not what it should be.
	 * @param command - the command string that is the key associated with the desired Error Command Object stack.
	 * @param parameters - an ArrayList containing any values you wish to pass to all Error Command Objects' in the stack.  
	 * This ArrayList appears as the 'paramters' value passed into all Error Command Objects in the stack.
	 */
	public static void handleError(String command, ArrayList<Object> parameters){
		if(theHandler == null && !handlerAttempted){
			try{
				Class handlerClass = Class.forName("android.os.Handler");
				handlerAttempted = true;
				theHandler = handlerClass.newInstance();
			}
			catch(Exception e){
				
			}
		}
		try{
			Class.forName("javax.servlet.GenericServlet");
			//is enterprise Java if no exception thrown
			new QCRequestHandler(command, parameters, null).dispatchToECO(command, parameters);
		}
		catch(Exception e){
			//is not enterprise Java
			if(theHandler != null){
				//must be android
				new QCRequestHandler(command, parameters, (android.os.Handler) theHandler).dispatchToECO(command, parameters);
			}
			else{
				new QCRequestHandler(command, parameters, null).dispatchToECO(command, parameters);
			}
		}
	}
	
	protected static HashMap<String, ArrayList<ControlObject>> getValidationMap() {
		return validationMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getBusinessMap() {
		return businessMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getViewMap() {
		return viewMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getErrorMap() {
		return errorMap;
	}
	/**
	 * This method maps a specific command to a Business Control Object (BCO).  
	 * BCOs are used to retrieve data from remote sources, local databases, and do data manipulation/calculation.
	 * @param command - the key used to identify the stack to which the specific BCO is to be mapped.
	 * @param handlerClass - the class of BCO to be added to the stack.  There may be as many different kinds of these added as needed.
	 */
	public static void mapCommandToBCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, businessMap);
	}
	/**
	 * This method maps a specific command to a View Control Object (VCO).  
	 * VCOs are used to update the user interface based on the data collected and calculated in the BCOs in the same stack.  
	 * VCOs are executed in the UI thread for Android and Java SE implementations.  No threading is done for Java EE since 
	 * Java EE applications are already threaded.
	 * @param command - the key used to identify the stack to which the specific VCO is to be mapped.
	 * @param handlerClass - the class of VCO to be added to the stack.  There may be as many different kinds of these added as needed.
	 */
	public static void mapCommandToVCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, viewMap);
	}
	/**
	 * This method maps a specific command to a Validation Control Object (ValCO).  
	 * ValCOs are used to validate data before the BCOs and VCOs are called.
	 * @param command - the key used to identify the stack to which the specific ValCO is to be mapped.
	 * @param handlerClass - the class of ValCO to be added to the stack.  There may be as many different kinds of these added as needed.
	 */
	public static void mapCommandToValCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, validationMap);
	}
	/**
	 * This method maps a specific command to a Error Control Object (ECO).  
	 * ECOs are used to notify the user of errors and do any cleanup necessary.  
	 * ECOs are executed in the UI thread for Android and Java SE implementations.  No threading is done for Java EE since 
	 * Java EE applications are already threaded.
	 * @param command - the key used to identify the stack to which the specific ECO is to be mapped.
	 * @param handlerClass - the class of ECO to be added to the stack.  There may be as many different kinds of these added as needed.
	 */
	public static void mapCommandToECO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, errorMap);
	}

	private static void mapCommandToHandler(String command, Class handlerClass,
			HashMap<String, ArrayList<ControlObject>> aMap) {
		if(command != null){
			ArrayList<ControlObject> handlers = null;
			if((handlers = aMap.get(command)) == null){
				handlers = new ArrayList<ControlObject>();
				aMap.put(command, handlers);
			}
			try {
				handlers.add((ControlObject)(handlerClass.newInstance()));
			} 
			catch (Exception e) {
				String message = "Unable to create object of type: "+handlerClass.getCanonicalName()+".  "+e.getCause();
				if(e.getMessage() != null){
					message = e.getMessage();
				}
				System.out.println(message);
			}
		}
		
	}
}
