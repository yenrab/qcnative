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

import java.util.HashMap;
/**
 * The ControlObject is an Interface that all control stack objects must implement.  It consists of one method, handleIt.
 * 
 *   Your ControlObjects must implement this interface.
 * @author Lee S. Barney
 *
 */
public interface ControlObject {
	/**
	 * 
	 * @param parameters - The parameters that will be passed by the QuickConnect class to all of your control stack objects.
	 *   The parameters HashMap is mutable.  Add key-value pairs to it to use them in later control objects.
	 * @return - Return <b>QC.EXIT_STACK</b> to terminate the execution of the stack containing this ControlObject or <b>QC.CONTINUE_STACK</b> to continue execution of the stack.
	 */
	public int  handleIt(HashMap<Object,Object> parameters);
}