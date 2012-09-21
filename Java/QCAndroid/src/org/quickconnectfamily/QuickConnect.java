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
 
 
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 
 
 */
package org.quickconnectfamily;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import android.os.Handler;

/**
 * The QuickConnect class is used to create control stacks and execute them.
 * Control stacks consist a few types of objects that all implement the
 * ControlObject interface. These types are:
 * <ol>
 * <li><b>ValCO</b> Validation Control Objects - these stacks objects are used
 * to validate values that will be used later in other control objects. The
 * items validated are usually passed in as parameters. By convention names for
 * objects of this type end with ValCO.</li>
 * <li><b>DCO</b> Data Control Objects - these stack objects are used to
 * interact with databases, remote servers, files, and are also used to do data
 * manipulation/computation. By convention names for objects of this type end
 * with DCO.</li>
 * <li><b>VCO</b>View Control Objects - these stack objects are used to do user
 * interface updates.</li>
 * <li><b>ECO</b>Error Control Objects - these stack objects are used to notify
 * the user of errors and do any view cleanup required if an bad data or an
 * error/exception occurs during the execution of a stack. By convention names
 * for objects of this type end with VCO.</li>
 * </ol>
 * 
 * An example of a login stack could include the following control objects:
 * <ul>
 * <li><b>CredentialsValCO</b> - the handleIt method performs length/content
 * validation on the user name and password. Returns either QC.STACK_EXIT if 
 * validation fails or QC.STACK_CONTINUE on passing validation</li>
 * <li><b>GetUserCO</b> - the handleIt method queries the database to see if a
 * user exists with the validated user name and password. Adds the user to the parameters map 
 * and returns the QC.STACK_CONTINUE or calls handleError and returns QC.STACK_EXIT.</li>
 * <li><b>LoginSuccessVCO</b> - the handleIt method updates the UI.</li>
 * 
 * @author Lee S. Barney
 * 
 */
public class QuickConnect {

	private static HashMap<String, ArrayList<ControlObject>> validationMap;
	private static HashMap<String, ArrayList<ControlObject>> dataMap;
	private static HashMap<String, ArrayList<ControlObject>> viewMap;
	private static HashMap<String, ArrayList<ControlObject>> errorMap;
	private static HashMap<String, ArrayList<String>> groupMap;


	private static Handler theMainThreadHandler;
	private static ThreadPoolExecutor thePool;
	private static Exception error;

	static {
		validationMap = new HashMap<String, ArrayList<ControlObject>>();
		dataMap = new HashMap<String, ArrayList<ControlObject>>();
		viewMap = new HashMap<String, ArrayList<ControlObject>>();
		errorMap = new HashMap<String, ArrayList<ControlObject>>();
		groupMap = new HashMap<String, ArrayList<String>>();
		try {
			SynchronousQueue<Runnable> worksQueue = new SynchronousQueue<Runnable>(
					true);
			RejectedExecutionHandler executionHandler = new PoolRejectedExecutionHandler();

			thePool = new ThreadPoolExecutor(3, Integer.MAX_VALUE, 10, TimeUnit.SECONDS,
					worksQueue, executionHandler);
			thePool.allowCoreThreadTimeOut(true);
			theMainThreadHandler = new Handler();
		} catch (Exception e) {
			thePool = null;
			error = e;
		}
	}

	/**
	 * This method is the Control Object stack trigger. Call it from anywhere in your
	 * user interface code to execute a stack created using the mapCommandTo** methods.
	 * 
	 * @param command
	 *            - the command string that is the key associated with the
	 *            desired Command Object stack.
	 * @param parameters
	 *            - a HashMap containing any key-value pairs you wish to pass to
	 *            all Command Objects' in the stack. If User Interface elements 
	 *            are to be added as values, a WeakReference to that element 
	 *            must be passed instead. This mutable HashMap 
	 *            appears as the 'parameters' value passed into all Command
	 *            Objects in the stack.
	 */
	
	public static void handleRequest(String command, HashMap<Object, Object>parameters){
		QuickConnect.handleRequest(command, parameters, true, null);
		
	}
	
	public static void handleRequest(String command, HashMap<Object, Object> parameters, boolean runInBackground, StackCallback aCallback) {
		if(thePool == null){
			error.printStackTrace();
		}
		ArrayList<String> subCommands = groupMap.get(command);
		if(subCommands != null){
			int numSubCommands = subCommands.size();
			for(int i = 0; i < numSubCommands; i++){
				QuickConnect.handleRequest(subCommands.get(i), parameters, runInBackground, aCallback);
			}
			return;
		}
		AtomicInteger numRequestsToTrack = new AtomicInteger(1);
		QuickConnect.handleRequest(command, parameters, runInBackground, aCallback, numRequestsToTrack);
		
	}
	
	public static void handleRequest(String[] commands, HashMap<Object, Object>parameters, boolean runInBackground, StackCallback aCallback){
		int numCommands = commands.length;
		AtomicInteger numRequestsToTrack = null;
		if(runInBackground){
			numRequestsToTrack = new AtomicInteger(1);
		}
		else{
			numRequestsToTrack = new AtomicInteger(numCommands);
		}
		for(int i = 0; i < numCommands; i++){
			QuickConnect.handleRequest(commands[i], parameters, runInBackground, aCallback, numRequestsToTrack);
		}
	}
	
	public static void handleRequest(CommandDescriptor aDescriptor){
		QuickConnect.handleRequest(aDescriptor.getCommand(), aDescriptor.getData(), aDescriptor.runInBackground(), aDescriptor.getCallback());
	}
	
	public static void handleBatchRequest(CommandDescriptor[] theDescriptors){
		int numDescriptors = theDescriptors.length;
		AtomicInteger numRequestsToTrack = new AtomicInteger(numDescriptors);
		for(int i = 0; i < numDescriptors; i++){
			CommandDescriptor aDescriptor = theDescriptors[i];
			QuickConnect.handleRequest(aDescriptor.getCommand(), aDescriptor.getData(), aDescriptor.runInBackground(), aDescriptor.getCallback(), numRequestsToTrack);
		}
	}

	private static void handleRequest(String command, HashMap<Object, Object> parameters, boolean runInBackground, StackCallback aCallback, AtomicInteger numRequestsToTrack) {
		if(runInBackground){
			thePool.execute(new ControlObjectStack(command, parameters, aCallback, numRequestsToTrack, theMainThreadHandler));
		}
		else{
			new ControlObjectStack(command, parameters, aCallback, numRequestsToTrack, theMainThreadHandler).run();
		}
	}

	/**
	 * This method is similar to handleRequest but is used to trigger stacks
	 * made of Error Control Objects. Call it from anywhere in your Control Object code where
	 * you wish to trigger a specified error handling stack. It is common to
	 * call this method from within Validation Control Objects if validation
	 * fails prior to returning QC.STACK_EXIT to terminate execution of the stack. It is
	 * also common to call this method from within Data Control Objects when
	 * data retrieved from remote sources or local databases is not what it
	 * should be.
	 * 
	 * @param command
	 *            - the command string that is the key associated with the
	 *            desired Error Command Object stack.
	 * @param parameters
	 *            - an ArrayList containing any values you wish to pass to all
	 *            Error Command Objects' in the stack. This ArrayList appears as
	 *            the 'paramters' value passed into all Error Command Objects in
	 *            the stack.
	 */
	public static void handleError(String command,HashMap<Object, Object> parameters) {
		new ControlObjectStack(command, parameters, null, new AtomicInteger(1), theMainThreadHandler).dispatchToECO(command,parameters);
	}

	protected static HashMap<String, ArrayList<ControlObject>> getValidationMap() {
		return validationMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getDataMap() {
		return dataMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getViewMap() {
		return viewMap;
	}

	protected static HashMap<String, ArrayList<ControlObject>> getErrorMap() {
		return errorMap;
	}

	/**
	 * This method maps a specific command to a Data Control Object (DCO).
	 * DCOs are used to retrieve data from remote sources, local databases, and
	 * do data manipulation/calculation.
	 * 
	 * @param command
	 *            - the key used to identify the stack to which the specific DCO
	 *            is to be mapped.
	 * @param controlObjectClass
	 *            - the class of DCO to be added to the stack. There may be as
	 *            many different kinds of these added as needed.
	 */
	public static void mapCommandToDCO(String command, Class<?> controlObjectClass) {
		mapCommandToControlObject(command, controlObjectClass, dataMap);
	}

	/**
	 * This method maps a specific command to a View Control Object (VCO). VCOs
	 * are used to update the user interface based on the data collected and
	 * calculated in the DCOs in the same stack. VCOs are executed in the UI
	 * thread for Android and Java SE implementations. No threading is done for
	 * Java EE since Java EE applications are already threaded.
	 * 
	 * @param command
	 *            - the key used to identify the stack to which the specific VCO
	 *            is to be mapped.
	 * @param controlObjectClass
	 *            - the class of VCO to be added to the stack. There may be as
	 *            many different kinds of these added as needed.
	 */
	public static void mapCommandToVCO(String command, Class<?> controlObjectClass) {
		mapCommandToControlObject(command, controlObjectClass, viewMap);
	}

	/**
	 * This method maps a specific command to a Validation Control Object
	 * (ValCO). ValCOs are used to validate data before the DCOs and VCOs are
	 * called.
	 * 
	 * @param command
	 *            - the key used to identify the stack to which the specific
	 *            ValCO is to be mapped.
	 * @param controlObjectClass
	 *            - the class of ValCO to be added to the stack. There may be as
	 *            many different kinds of these added as needed.
	 */
	public static void mapCommandToValCO(String command, Class<?> controlObjectClass) {
		mapCommandToControlObject(command, controlObjectClass, validationMap);
	}

	/**
	 * This method maps a specific command to a Error Control Object (ECO). ECOs
	 * are used to notify the user of errors and do any cleanup necessary. ECOs
	 * are executed in the UI thread for Android and Java SE implementations. No
	 * threading is done for Java EE since Java EE applications are already
	 * threaded.
	 * 
	 * @param command
	 *            - the key used to identify the stack to which the specific ECO
	 *            is to be mapped.
	 * @param controlObjectClass
	 *            - the class of ECO to be added to the stack. There may be as
	 *            many different kinds of these added as needed.
	 */
	public static void mapCommandToECO(String command, Class<?> controlObjectClass) {
		mapCommandToControlObject(command, controlObjectClass, errorMap);
	}

	private static void mapCommandToControlObject(String command, Class<?> controlObjectClass,
			HashMap<String, ArrayList<ControlObject>> aMap) {
		if (command != null) {
			ArrayList<ControlObject> handlers = null;
			if ((handlers = aMap.get(command)) == null) {
				handlers = new ArrayList<ControlObject>();
				aMap.put(command, handlers);
			}
			try {
				handlers.add((ControlObject) (controlObjectClass.newInstance()));
			} catch (Exception e) {
				String message = "Unable to create object of type: "
						+ controlObjectClass.getCanonicalName() + ".  "
						+ e.getCause();
				if (e.getMessage() != null) {
					message = e.getMessage();
				}
				System.out.println(message);
			}
		}

	}
	
	public void mapCommandToSubCommands(String command, String[] subCommands) throws Exception{
		if(command == null || subCommands == null){
			throw new Exception("Error: Missing a command. Both the command and subCommands must not be null.");
		}
		int numCommands = subCommands.length;
		for(int i = 0; i < numCommands; i++){
			addSubCommand(command, subCommands[i]);
		}
	}
	
	private void addSubCommand(String aCommand, String aSubCommand) throws Exception{
		if(aCommand == null || aSubCommand == null){
			throw new Exception("Error: attempting to add a null sub-command to "+aCommand);
		}
		ArrayList<String> subCommands = groupMap.get(aCommand);
		if(subCommands == null){
			subCommands = new ArrayList<String>();
			groupMap.put(aCommand, subCommands);
		}
		subCommands.add(aSubCommand);
	}
}
