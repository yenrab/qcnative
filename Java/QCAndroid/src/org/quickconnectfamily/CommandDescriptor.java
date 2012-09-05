/*
 Copyright (c) 2012 Lee Barney
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

import java.util.HashMap;

public class CommandDescriptor {
	private String cmd;
	private HashMap<Object, Object> parameters;
	private StackCallback callback;
	private boolean runInBackground;
	
	
	
	public CommandDescriptor(String cmd, HashMap<Object, Object> parameters,
			StackCallback callback, boolean runInBackground) {
		super();
		this.cmd = cmd;
		this.parameters = parameters;
		this.callback = callback;
		this.runInBackground = runInBackground;
	}
	public String getCommand() {
		return cmd;
	}
	public HashMap<Object,Object> getData() {
		return parameters;
	}
	public StackCallback getCallback() {
		return callback;
	}
	public boolean runInBackground(){
		return runInBackground;
	}
	
	
}
