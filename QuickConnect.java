/*
 Copyright (c) 2008, 2009 Lee Barney
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
	
	public static void mapCommandToBCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, businessMap);
	}

	public static void mapCommandToVCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, viewMap);
	}

	public static void mapCommandToValCO(String command, Class handlerClass){
		mapCommandToHandler(command, handlerClass, validationMap);
	}

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
