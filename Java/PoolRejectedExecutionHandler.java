package org.quickconnect;

import java.util.concurrent.RejectedExecutionHandler;
import java.util.concurrent.ThreadPoolExecutor;

public class PoolRejectedExecutionHandler implements RejectedExecutionHandler {

	public void rejectedExecution(Runnable runnable, ThreadPoolExecutor executor) {
        System.out.println(runnable.toString() + " : I've been rejected ! ");

	}

}
