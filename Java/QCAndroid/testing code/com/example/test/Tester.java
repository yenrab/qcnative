package com.example.test;

import java.lang.ref.WeakReference;
import java.util.HashMap;

import org.quickconnectfamily.ControlObject;
import org.quickconnectfamily.QC;


public class Tester implements ControlObject {
	@SuppressWarnings("unchecked")
	@Override
	public Boolean handleIt(HashMap<Object, Object> parameters) {
        System.out.println("worker thread: "+Thread.currentThread().getId());
		WeakReference<Object>theStuff = (WeakReference<Object>)parameters.get("stuff");
		int test = 50;
		while(test > 0){
			test--;
			System.out.println("weak ref is: "+theStuff);
			//Object theButton = theStuff.get();
			if(theStuff.get() == null){
				System.out.println("the button is: null");
				break;
			}
			else{
				/*
				 * This will cause a memory leak.
				 * Why does this happen??? Defect in Dalvik????
				 */
				Thing aThing = (Thing)theStuff.get();
				System.out.println("the button is: "+aThing.getName());
				
				/*
				 * This will not cause a memory leak.
				 */
				//System.out.println("the thing is: "+((Thing)theStuff.get()).getName());
			}
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return QC.STACK_EXIT;
	}

}
