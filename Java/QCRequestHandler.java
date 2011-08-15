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

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;

import org.quickconnectfamily.hybrid.QCAndroid;
/*
 * This class is used by the QuickConnect class to do the actual work of executing the call stack.  Its methods 
 * handle the threading issues such as when to execute control stack object handleIt methods in the main UI thread.
 */
public class QCRequestHandler implements Runnable {
	private String command;
	private HashMap<String,Object> parameters;
	private boolean isAndroid = true;
	private boolean isEnterprise = true;
	private android.os.Handler theHandler;
	
	
	public QCRequestHandler(String command, HashMap<String, Object> parameters, android.os.Handler aHandler){
    
		this.command = command;
		this.parameters = parameters;
		theHandler = aHandler;
		try{
			Class.forName("android.os.Looper");
		}
		catch(Exception e){
			isAndroid = false;
		}
		try{
			Class.forName("javax.servlet.GenericServlet");
		}
		catch(Exception e){
			isEnterprise = false;
		}
	}
	/*
	 * (non-Javadoc)
	 * @see java.lang.Runnable#run()
	 * This method executes first, the validation control objects, then the business control objects, and then the view control objects.
	 */
	public void run() {
		//System.out.println("running");
		if(checkValidation(command, parameters)){
			//System.out.println("passed validation");
			final HashMap<String, Object> newParameters = dispatchToBCO(command, parameters);
			if(newParameters == null){
				return;
			}
			if(!isEnterprise){
				if(isAndroid){
					final QCRequestHandler self = this;
					//System.out.println("posting to run vco's");
					QCAndroid act = (QCAndroid) newParameters.get("activity");
					act.runOnUiThread(new Runnable(){
						  public void run() {
							self.dispatchToVCO(command, newParameters);
						  }
					});
				}
				else{
					//must be JavaSE
					try {
						Class swingUtilsClass = Class.forName("javax.swing.SwingUtilities");
						Method laterMethod = swingUtilsClass.getDeclaredMethod("invokeLater", Runnable.class);
				

						laterMethod.invoke(null,new Runnable() {
						    public void run() {
						    	dispatchToVCO(command, newParameters);
						    }
						  });
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
			else{
				//running in enterprise environment
				dispatchToVCO(command, newParameters);
			}
		}
	}
	/*
	 * This method executes all of the Validation Control Objects that have been mapped to a specific command.  
	 * If any of them return false the loop is terminated and false is returned.  
	 * If they all return true, or no Validation Control Objects have been defined for the specific command, then true is returned.
	 */
	private boolean checkValidation(String command, HashMap<String, Object> parameters2){
		Boolean result = true;
		try{
			ArrayList<ControlObject> COList = QuickConnect.getValidationMap().get(command);
			if(COList != null){
				int numValCOs = COList.size();
				for(int i = 0; i < numValCOs; i++){
					try {
						ControlObject handler = COList.get(i);
						result = (Boolean)handler.handleIt(parameters2);
						if(result == false){
							break;
						}
					} catch (Exception e) {
						result = false;
						break;
					}
				}
			}
		}
		catch(Exception e){
			result = false;
		}
		return result;
	}
	/*
	 * A facade method that executes all Business Control Objects mapped to a specific command.
	 */
	private HashMap<String, Object> dispatchToBCO(String command, HashMap<String, Object> parameters){
		return dispatchToHandlers(QuickConnect.getBusinessMap(), command, parameters);
	}
	/*
	 * A facade method that executes all View Control Objects mapped to a specific command.
	 */
	private HashMap<String,Object> dispatchToVCO(String command, HashMap<String,Object> parameters){
		return dispatchToHandlers(QuickConnect.getViewMap(), command, parameters);
	}

	/*
	 * This method executes all of the Error Control Objects that have been mapped to a specific command.  
	 * Error control object handleIt methods are executed in the main UI thread since it is assumed that they will be used
	 * to communicate to the user.
	 */
	public HashMap<String,Object> dispatchToECO(String command, HashMap<String,Object> parameters){
		
		if(!isEnterprise){
			if(isAndroid){
					final QCRequestHandler self = this;
					final String aCommand = command;
					final HashMap<String,Object> newParameters = parameters;
					theHandler.post(new Runnable(){
						  public void run() {
							  Object result = (HashMap<String,Object>)self.dispatchToHandlers(QuickConnect.getErrorMap(), aCommand, newParameters);
						  }
					});
			}
			else{
				//must be JavaSE
				
				try {
					final String aCommand = command;
					final HashMap<String,Object> someParameters = parameters;
					
					Class swingUtilsClass = Class.forName("javax.swing.SwingUtilities");
					Method laterMethod = swingUtilsClass.getDeclaredMethod("invokeLater", Runnable.class);
					//Object[] params = new Object[1];
					//params[0] = 
					laterMethod.invoke(null, new Runnable() {
					    public void run() {
					    	Object result = (HashMap<String,Object>)dispatchToHandlers(QuickConnect.getErrorMap(), aCommand, someParameters);
					    }
					  });
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		else{
			//running in enterprise environment
			dispatchToHandlers(QuickConnect.getErrorMap(), command, parameters);
		}
		return new HashMap<String,Object>();
	}

	/*
	 * This method is the worker behind the dispatchToVCO and dispatchToBCO facade methods.  
	 * It  executes all of the control objects that have been mapped to a specific command found in each of the HashMaps for the
	 * VCO or BCO types.  If any VCO or BCO returns null then stack the dispatchToHandlers method returns null and stack execution 
	 * is terminated.
	 * 
	 */
	private HashMap<String,Object> dispatchToHandlers(HashMap<String, ArrayList<ControlObject> > map, String command, HashMap<String, Object> parameters){
		
		HashMap<String,Object> resultData = new HashMap<String,Object>();
		if(parameters != null){
			resultData.putAll(parameters);
		}
		ArrayList<Object> results = new ArrayList<Object>();
		resultData.put("bcoResults", results);
		ArrayList<ControlObject> COList = map.get(command);
		if(COList != null){
			int numCOs = COList.size();
			for(int i = 0; i < numCOs; i++){
				Object result = null;
				Object handler = null;
				handler = COList.get(i);
				if(handler != null){
					try {
						result = ((ControlObject)handler).handleIt(resultData);
						if(result == null){
							resultData = null;
							break;
						}
					}
					catch (Exception e) {
						String message = handler.getClass().getCanonicalName()+"'s handleIt method threw an exception.  " + e.toString() + e.getCause();
						if(e.getMessage() != null){
							//message = e.getMessage();
							System.out.println(message);
						}
					}
				} if(result != null){
					results.add(result);
				}
			}
		}
		return resultData;
	}
	
}
