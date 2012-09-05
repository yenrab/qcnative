package org.quickconnectfamily;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class StackWaitMonitor {
	private ReentrantLock theLock;
	private Condition theCondition;
	public StackWaitMonitor() {
		this.theLock = new ReentrantLock();
		this.theCondition = this.theLock.newCondition();
	}
	
	public void makeStackWait(){
		this.theLock.lock();
		try {
			theCondition.await();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally{
			this.theLock.unlock();
		}
	}
	public void continueStack(){
		this.theLock.lock();
		theCondition.signal();
		this.theLock.unlock();
	}

}
