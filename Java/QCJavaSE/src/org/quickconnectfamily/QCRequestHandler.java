/*
 Copyright (c) 2008, 2009, 2011, 2012 Lee Barney
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
import java.util.concurrent.atomic.AtomicInteger;

import javax.swing.SwingUtilities;
/*
 * QCJavaSE uses the CommandDescriptor, ControlObject, PoolRejectedExecutionHandler, QC, StackCallback, and StackWaitMonitor classes
 * found in the QCAndroid src directory.
 */

/*
 * This class is used by the QuickConnect class to do the actual work of executing the call stack.  Its methods 
 * handle the threading issues such as when to execute control stack object handleIt methods in the main UI thread.
 */
public class QCRequestHandler implements Runnable {
	private String command;
	private HashMap<Object,Object> parameters;
	private StackCallback aCallback;
	private AtomicInteger numRequestsToTrack;
	private StackWaitMonitor theMonitor;
	
	
	public QCRequestHandler(String command, HashMap<Object, Object> parameters, StackCallback aCallback, AtomicInteger numRequestsToTrack){
    
		this.command = command;
		this.parameters = parameters;
		this.aCallback = aCallback;
		this.numRequestsToTrack = numRequestsToTrack;
		this.theMonitor = new StackWaitMonitor();
		parameters.put("stackMonitor", this.theMonitor);
	}
	/*
	 * (non-Javadoc)
	 * @see java.lang.Runnable#run()
	 * This method executes first, the validation control objects, then the data control objects, and then the view control objects.
	 */
	public void run() {
		System.out.println("running request handler");
		/*
		 * This try-catch is there to make sure the app
		 * doesn't crash if a control object is attempting
		 * to update something and the activity spawning
		 * the request disappears.
		 */
		try{
			//System.out.println("running");
			if(checkValidation(command, parameters) == QC.STACK_CONTINUE){
				//System.out.println("passed validation");
				if(dispatchToDCO(command, parameters) == QC.STACK_CONTINUE){
					SwingUtilities.invokeLater(new Runnable(){
						  public void run() {
							  QCRequestHandler.this.dispatchToVCO(command, parameters);
							  checkExecuteCallback();	
						  }
					});
				}
				else{
					  checkExecuteCallback();
				}
			}
			else{
				  checkExecuteCallback();
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
	/*
	 * This method executes all of the Validation Control Objects that have been mapped to a specific command.  
	 * If any of them return false the loop is terminated and false is returned.  
	 * If they all return true, or no Validation Control Objects have been defined for the specific command, then true is returned.
	 */
	private int checkValidation(String command, HashMap<Object,Object> parameters){
		return dispatchToHandlers(QuickConnect.getValidationMap(), command, parameters);
	}
	/*
	 * A facade method that executes all Data Control Objects mapped to a specific command.
	 */
	private int dispatchToDCO(String command, HashMap<Object, Object> parameters){
		return dispatchToHandlers(QuickConnect.getDataMap(), command, parameters);
	}
	/*
	 * A facade method that executes all View Control Objects mapped to a specific command.
	 */
	private int dispatchToVCO(String command, HashMap<Object, Object> parameters){
		return dispatchToHandlers(QuickConnect.getViewMap(), command, parameters);
	}

	/*
	 * This method executes all of the Error Control Objects that have been mapped to a specific command.  
	 * Error control object handleIt methods are executed in the main UI thread since it is assumed that they will be used
	 * to communicate to the user.
	 */
	public void dispatchToECO(final String command, final HashMap<Object,Object> parameters){
		SwingUtilities.invokeLater(new Runnable(){
			  public void run() {
				  QCRequestHandler.this.dispatchToHandlers(QuickConnect.getErrorMap(), command, parameters);
			  }
		});
	}

	/*
	 * This method is the worker behind the dispatchToVCO and dispatchToBCO facade methods.  
	 * It  executes all of the control objects that have been mapped to a specific command found in each of the HashMaps for the
	 * VCO or BCO types.  If any VCO or BCO returns null then stack the dispatchToHandlers method returns null and stack execution 
	 * is terminated.
	 * 
	 */
	private int dispatchToHandlers(HashMap<String, ArrayList<ControlObject> > map, String command, HashMap<Object,Object> parameters){
		
		int result = QC.STACK_CONTINUE;
		ArrayList<ControlObject> COList = map.get(command);
		if(COList != null){
			int numCOs = COList.size();
			for(int i = 0; i < numCOs; i++){
				ControlObject handler = null;
				handler = COList.get(i);
				if(handler != null){
					try {
						result = handler.handleIt(parameters);
						if(result == QC.STACK_EXIT){
							break;
						}
						if(result == QC.STACK_WAIT){
							this.theMonitor.makeStackWait();
						}
					}
					catch (Exception e) {
						String message = handler.getClass().getCanonicalName()+"'s handleIt method threw an exception.  " + e.toString() + e.getCause();
						System.out.println(message);
						result = QC.STACK_EXIT;
						break;
					}
				} 
			}
		}
		return result;
	}
	private void checkExecuteCallback() {
		int requestsNotYetComplete = numRequestsToTrack.decrementAndGet();
		  if(aCallback != null && requestsNotYetComplete <= 0){
			  aCallback.execute(parameters);
		  }
	}
	
}
